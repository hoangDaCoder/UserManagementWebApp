namespace UserManagementWebApp.Models
{
    public class User
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required DateTime DateOfBirth { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Address { get; set; }
    }
}
