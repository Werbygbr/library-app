using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LibraryApi.Models;

public class Author
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string Name { get; set; } = null!;
    public string Nationality { get; set; } = null!;
    public int BirthYear { get; set; }
}