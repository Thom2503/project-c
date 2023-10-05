using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;
using Microsoft.EntityFrameworkCore;

public class Events
{
    [Key]
    public int EventsID { get; set; }

    [Required]
    [MaxLength(128)]
    public string Title { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    [DataType(DataType.DateTime)]
    public DateTime Time {get; set;}

    [Required]
    [MaxLength(60)]
    public string Location { get; set; }

    [Required]
    public bool IsTentative { get; set; }

    [DataType(DataType.DateTime)]
    public DateTime TentativeTime {get; set;}

    [Required]
    [DataType(DataType.DateTime)]
    public DateTime DeclineTime {get; set;}

    [Required]
    public bool IsExternal { get; set; }

    [Required]
    public int AccountsId { get; set; }

    [Required]
    public string Status {get; set;}
}