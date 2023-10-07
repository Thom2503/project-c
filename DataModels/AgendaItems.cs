using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

public class AgendaItems
{
    [Key]
    public int AgendaItemsID { get; set; }

    [Required]
    [MaxLength(60)]
    public string Title { get; set; }

    [Required]
    public string Note { get; set; }

    [Required]
    [DataType(DataType.DateTime)]
    public DateTime StartDate {get; set;}

    [Required]
    [DataType(DataType.DateTime)]
    public DateTime EndDate {get; set;}

    [Required]
    [MaxLength(60)]
    public string Location { get; set; }

    [Required]
    public int AccountsId { get; set; }

    [Required]
    public string Status {get; set;}
}