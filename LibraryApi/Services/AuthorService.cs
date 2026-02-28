using LibraryApi.Models;
using LibraryApi.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace LibraryApi.Services;

public class AuthorService
{
    private readonly IMongoCollection<Author> _authors;

    public AuthorService(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var db = client.GetDatabase(settings.Value.DatabaseName);
        _authors = db.GetCollection<Author>("Authors");
    }

    public async Task<List<Author>> GetAllAsync() =>
        await _authors.Find(_ => true).ToListAsync();

    public async Task<Author?> GetByIdAsync(string id) =>
        await _authors.Find(a => a.Id == id).FirstOrDefaultAsync();

    public async Task<Author> CreateAsync(Author author)
    {
        await _authors.InsertOneAsync(author);
        return author;
    }

    public async Task UpdateAsync(string id, Author updated) =>
        await _authors.ReplaceOneAsync(a => a.Id == id, updated);

    public async Task DeleteAsync(string id) =>
        await _authors.DeleteOneAsync(a => a.Id == id);
}