namespace backend.DtoModels
{
    public class ResponseMessage<T>
    {
        public bool  Success { get; set; }
        public string Message { get; set; }

        public string ErrorMessage { get; set; }
        public T? Data { get; set; }
    }
}
