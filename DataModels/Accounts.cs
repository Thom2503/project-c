using System.ComponentModel.DataAnnotations;

public class Accounts
{
    [Key]
    public int AccountsID { get; set; }

    [Required]
    [MaxLength(256)]
    public string Email { get; set; }

    [Required]
    [MaxLength(60)]
    public string FirstName { get; set; }

    [Required]
    [MaxLength(60)]
    public string LastName { get; set; }

    [Required]
    public bool IsAdmin { get; set; }

    [Required]
    public string Function { get; set; }
}