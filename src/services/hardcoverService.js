// Hardcover GraphQL & OpenLibrary Service calling /api/book
import { HC_TOKEN } from '../config/constants.js';

export async function queryHardcover(query, variables = {}) {
    const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables, token: HC_TOKEN })
    });

    if (!res.ok) {
        throw new Error(`Hardcover Proxy Error: HTTP ${res.status}`);
    }

    return await res.json();
}

export async function searchHardcoverByTitle(term) {
    const query = `
        query BookSearch($term: String!) {
          books(where: {title: {_ilike: $term}}, limit: 15) {
              id
              title
              image {
                  url
              }
              contributions {
                  author {
                      name
                  }
              }
              editions {
                  id
                  title
                  edition_format
                  pages
                  release_date
                  isbn_10
                  isbn_13
                  publisher {
                      name
                  }
                  image {
                      url
                  }
              }
          }
        }
    `;
    const variables = { term: `%${term}%` };

    try {
        const json = await queryHardcover(query, variables);
        const foundBooks = json.data?.books;
        if (foundBooks && foundBooks.length > 0) {
            return { books: foundBooks, source: 'hardcover' };
        }
    } catch (err) {
        console.warn("Hardcover GraphQL search failed, falling back to Open Library:", err);
    }

    // Open Library fallback
    try {
        const olRes = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(term)}&limit=10`);
        const olData = await olRes.json();

        if (olData.docs && olData.docs.length > 0) {
            const books = olData.docs.map(doc => ({
                title: doc.title,
                image: { url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : '' },
                contributions: [{ author: { name: doc.author_name ? doc.author_name[0] : 'Unknown Author' } }],
                editions: [{
                    publisher: { name: doc.publisher ? doc.publisher[0] : 'Standard Publisher' },
                    edition_format: 'Hardcover',
                    isbn_13: doc.isbn ? doc.isbn[0] : ''
                }]
            }));
            return { books, source: 'openlibrary' };
        }
    } catch (olErr) {
        console.error("Open Library fallback error:", olErr);
    }

    return { books: [], source: 'none' };
}

export async function searchHardcoverByISBN(cleanIsbn) {
    const query = `
        query GetEditionByISBN($isbn: String!) {
          editions(where: {isbn_13: {_eq: $isbn}}) {
              id
              title
              edition_format
              pages
              release_date
              isbn_10
              isbn_13
              publisher {
                  name
              }
              image {
                  url
              }
              book {
                  title
                  image {
                      url
                  }
                  contributions {
                      author {
                          name
                      }
                  }
              }
          }
        }
    `;
    const variables = { isbn: cleanIsbn };

    try {
        const json = await queryHardcover(query, variables);
        const foundEditions = json.data?.editions;

        if (foundEditions && foundEditions.length > 0) {
            const ed = foundEditions[0];
            return {
                title: ed.book?.title || ed.title || '',
                authors: ed.book?.contributions?.map(c => c.author?.name).filter(Boolean) || [],
                publisher: ed.publisher?.name || '',
                isbn: ed.isbn_13 || ed.isbn_10 || '',
                editionFormat: ed.edition_format || '',
                imageUrl: ed.image?.url || ed.book?.image?.url || '',
                source: 'hardcover'
            };
        }
    } catch (err) {
        console.warn("Hardcover ISBN search failed, falling back to Open Library:", err);
    }

    // Open Library ISBN fallback
    try {
        const olRes = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`);
        const olData = await olRes.json();
        const bookKey = `ISBN:${cleanIsbn}`;

        if (olData[bookKey]) {
            const b = olData[bookKey];
            return {
                title: b.title || '',
                authors: b.authors ? b.authors.map(a => a.name) : [],
                publisher: b.publishers ? b.publishers[0]?.name : '',
                isbn: cleanIsbn,
                editionFormat: 'Hardcover',
                imageUrl: b.cover ? (b.cover.large || b.cover.medium) : '',
                source: 'openlibrary'
            };
        }
    } catch (olErr) {
        console.error("Open Library ISBN fallback error:", olErr);
    }

    return null;
}
