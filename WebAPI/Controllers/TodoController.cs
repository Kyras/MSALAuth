using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.Identity.Web.Resource;
using WebAPI.Model;


namespace WebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private static readonly string[] ReadMyDataScopes = new[] {"access_as_user", "access_as_admin"};
        private static readonly string[] ReadAllDataScopes = new[] {"access_as_admin"};

        private readonly List<TodoItem> _data = new();

        private string Owner => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        [HttpGet]
        public ActionResult<IEnumerable<TodoItem>> GetTodoItems()
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(ReadMyDataScopes);

            var result = _data.FindAll(item => item.Owner == Owner);

            return Ok(result);
        }

        [HttpGet("{id:long}")]
        public ActionResult<IEnumerable<TodoItem>> GetTodoItem(long id)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(ReadMyDataScopes);

            var result = _data.Find(item => item.Id == id);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public ActionResult<TodoItem> PostTodoItem(TodoItemPostDTO todoItem)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(ReadMyDataScopes);

            var toInsert = new TodoItem()
            {
                Id = _data.Max(item => item.Id) + 1,
                Description = todoItem.Description,
                Owner = Owner,
                Done = todoItem.Done,
            };

            _data.Add(toInsert);

            return Ok(toInsert);
        }
    }
}