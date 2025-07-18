using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet]
        [Route("GetAllUsers/")]
        public async Task<ActionResult> GetAllUsers()
        {
            var result = _userService.GetAllUsers();
            return Ok(result);
        }
    }
}
