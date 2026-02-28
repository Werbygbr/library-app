using LibraryApi.Models;
using LibraryApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookService _service;

    public BooksController(BookService service) => _service = service;

    [HttpGet]
    public async Task<List<Book>> GetAll() => await _service.GetAllAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> GetById(string id)
    {
        var book = await _service.GetByIdAsync(id);
        return book is null ? NotFound() : Ok(book);
    }

    [HttpPost]
    public async Task<ActionResult<Book>> Create(Book book)
    {
        var created = await _service.CreateAsync(book);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Book updated)
    {
        var existing = await _service.GetByIdAsync(id);
        if (existing is null) return NotFound();
        updated.Id = id;
        await _service.UpdateAsync(id, updated);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var existing = await _service.GetByIdAsync(id);
        if (existing is null) return NotFound();
        await _service.DeleteAsync(id);
        return NoContent();
    }
}