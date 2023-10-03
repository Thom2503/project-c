using System.ComponentModel.DataAnnotations;

public class Accounts
{
    [Key]
    public int AccountsId { get; set; }

    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    public string Function { get; set; }

    [Required]
    public bool IsAdmin { get; set; }
}