using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web.Resource;
using WebAPI.Model;


namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [RequiredScope(RequiredScopesConfigurationKey = "AzureAd:Scopes")]
    public class TodoController : ControllerBase
    {
        private static readonly List<TodoItem> Data = new();

        private readonly ILogger<TodoController> _logger;

        public TodoController(ILogger<TodoController> logger)
        {
            _logger = logger;
        }

        private string Owner => User.FindFirst("name")?.Value;

        [HttpGet]
        [Authorize("Role", Roles = "Todos.User Todos.Manager")]
        public ActionResult<IEnumerable<TodoItem>> GetTodoItems()
        {
            var result = Data.FindAll(item => item.Owner == Owner);

            _logger.LogInformation("Returning {Count} todos", result.Count);
            return Ok(result);
        }

        [HttpGet("{id:long}")]
        [Authorize("Role", Roles = "Todos.User Todos.Manager")]
        public ActionResult<IEnumerable<TodoItem>> GetTodoItem(long id)
        {
            var result = Data.Find(item => item.Id == id && item.Owner == Owner);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize("Role", Roles = "Todos.User Todos.Manager")]
        public ActionResult<TodoItem> PostTodoItem(TodoItemPostDTO todoItem)
        {
            var toInsert = new TodoItem()
            {
                Id = Data.Count > 0 ? Data.Max(item => item.Id) + 1 : 0,
                Description = todoItem.Description,
                Owner = Owner,
                Done = todoItem.Done,
            };

            Data.Add(toInsert);

            return Ok(todoItem);
        }
    }
}
