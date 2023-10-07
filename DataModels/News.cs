using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;
using Microsoft.EntityFrameworkCore;

public class News
{
    [Key]
    public int NewsID { get; set; }

    [Required]
    [MaxLength(128)]
    public string Title { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    public string Image { get; set; }

    [Required]
    [DataType(DataType.DateTime)]
    public DateTime PostTime {get; set;}

    [Required]
    public int AccountsId { get; set; }

    [Required]
    public string Status {get; set;}
}