using LibraryApi.Models;
using LibraryApi.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace LibraryApi.Services;

public class BookService
{
    private readonly IMongoCollection<Book> _books;

    public BookService(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var db = client.GetDatabase(settings.Value.DatabaseName);
        _books = db.GetCollection<Book>("Books");
    }

    public async Task<List<Book>> GetAllAsync() =>
        await _books.Find(_ => true).ToListAsync();

    public async Task<Book?> GetByIdAsync(string id) =>
        await _books.Find(b => b.Id == id).FirstOrDefaultAsync();

    public async Task<Book> CreateAsync(Book book)
    {
        await _books.InsertOneAsync(book);
        return book;
    }

    public async Task UpdateAsync(string id, Book updated) =>
        await _books.ReplaceOneAsync(b => b.Id == id, updated);

    public async Task DeleteAsync(string id) =>
        await _books.DeleteOneAsync(b => b.Id == id);
}