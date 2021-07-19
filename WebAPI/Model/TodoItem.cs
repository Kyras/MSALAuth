namespace WebAPI.Model
{
    public class TodoItem
    {
        public long Id { get; set; }
        public string Description { get; set; }
        public string Owner { get; set; }
        public bool Done { get; set; }
    }
}