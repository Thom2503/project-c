using System.ComponentModel.DataAnnotations;

public class Supplies
{
    [Key]
    public int SuppliesID { get; set; }

    [Required]
    [MaxLength(128)]
    public string Name { get; set; }

    [Required]
    [MaxLength(3)]
    public int Total { get; set; }


}