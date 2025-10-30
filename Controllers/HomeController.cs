using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using UserManagementWebApp.Data;
using UserManagementWebApp.Models;

namespace UserManagementWebApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserServices _userServices;

        public HomeController(ILogger<HomeController> logger, UserServices userServices)
        {
            _logger = logger;
            _userServices = userServices;
        }

        public IActionResult Index()
        {
            var users = _userServices.GetAllUsers();
            return View(users);
        }

        [HttpPost]
        public IActionResult AddUser([FromBody] User user)
        {
            if (user == null)
            {
                return Json(new { success = false, message = user });
            }
            _userServices.AddUser(user);
            return Json(new {success = true, message = "Thêm người dùng mới thành công!"});
        }

        public class DeleteRequest
        {
            public List<int> Ids { get; set; } = new List<int>();
        }

        [HttpPost]
        public IActionResult DeleteUsers([FromBody] DeleteRequest request)
        {
            if (request == null || request.Ids == null || !request.Ids.Any())
            {
                return Json(new { success = false, message = "Không có người dùng nào được cung cấp!" });
            }
            try
            {
                _userServices.DeleteUsers(request.Ids);
                return Json(new { success = true, message = $"Đã xóa {request.Ids.Count} người dùng!" });
            } catch (Exception ex)
            {
                return Json(new { success = false, message = "Xóa người dùng thất bại: " + ex.Message });
            }
        }
        [HttpPut]
        public IActionResult UpdateUser([FromBody] User user)
        {
            if (user == null)
            {
                return Json(new { success = false, message = "Sửa thông tin người dùng không thành công!"});
            }
            _userServices.UpdateUser(user);
            return Json(new { success = true, message = "Sửa thông tin người dùng thành công!" });
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
