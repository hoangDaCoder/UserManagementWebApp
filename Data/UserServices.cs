using System.Text.Json;
using UserManagementWebApp.Models;

namespace UserManagementWebApp.Data
{
    public class UserServices
    {
        private readonly IWebHostEnvironment _env;
        private readonly string _filePath;
        public UserServices(IWebHostEnvironment env)
        {
            _env = env;
            _filePath = Path.Combine(_env.ContentRootPath, "Data", "Users.json");
        }
        public List<User> GetAllUsers()
        {
            if (!File.Exists(_filePath))
            {
                return new List<User>();
            }
            var jsonData = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<User>>(jsonData) ?? new List<User>();
        }
        public void AddUser(User user)
        {
            var users = GetAllUsers() ?? new List<User>();
            int nextID = users.Any() ? users.Max(u => u.Id) + 1 : 1;
            user.Id = nextID;

            users.Add(user);
            SaveUsersToFile(users);
        }
        public void DeleteUsers(List<int> Ids)
        {
            if (Ids == null || Ids.Count == 0) return;
            var users = GetAllUsers();
            users.RemoveAll(u => Ids.Contains(u.Id));
            SaveUsersToFile(users);
        }
        public void UpdateUser(User updatedUser)
        {
            var users = GetAllUsers();
            var existingUser = users.FirstOrDefault(u => u.Id == updatedUser.Id);
            if (existingUser != null)
            {
                existingUser.Name = updatedUser.Name;
                existingUser.DateOfBirth = updatedUser.DateOfBirth;
                existingUser.Email = updatedUser.Email;
                existingUser.PhoneNumber = updatedUser.PhoneNumber;
                existingUser.Address = updatedUser.Address;
                SaveUsersToFile(users);
            }
        }
        private void SaveUsersToFile(List<User> users)
        {
            var jsonData = JsonSerializer.Serialize(users, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, jsonData);
        }
    }
}