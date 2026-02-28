using LibraryApi.Models;
using LibraryApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorsController : ControllerBase
{
    private readonly AuthorService _service;

    public AuthorsController(AuthorService service) => _service = service;

    [HttpGet]
    public async Task<List<Author>> GetAll() => await _service.GetAllAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Author>> GetById(string id)
    {
        var author = await _service.GetByIdAsync(id);
        return author is null ? NotFound() : Ok(author);
    }

    [HttpPost]
    public async Task<ActionResult<Author>> Create(Author author)
    {
        var created = await _service.CreateAsync(author);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Author updated)
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