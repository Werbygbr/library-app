using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LibraryApi.Models;

public class Book
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string Title { get; set; } = null!;
    public string AuthorId { get; set; } = null!;
    public int Year { get; set; }
    public string Genre { get; set; } = null!;
    public string Description { get; set; } = null!;
}