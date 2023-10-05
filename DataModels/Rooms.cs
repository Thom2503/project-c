using System.ComponentModel.DataAnnotations;

public class Rooms
{
    [Key]
    public int RoomsID { get; set; }

    [Required]
    [MaxLength(60)]
    public string Name { get; set; }

    [Required]
    [MaxLength(3)]
    public int Capacity { get; set; }

    
}