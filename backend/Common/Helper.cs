using System.Security.Cryptography;
using System.Text;

namespace backend.Common
{
    public class Helper
    {
        public IConfiguration Configuration { get; }
        public Helper(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public static byte[] HashPasswordWithSalt(byte[] toBeHashed, byte[] salt)
        {
            using (var sha256 = SHA256.Create())
            {
                var combinedHash = Combine(toBeHashed, salt);

                return sha256.ComputeHash(combinedHash);
            }
        }
        public static byte[] Combine(byte[] first, byte[] second)
        {
            var ret = new byte[first.Length + second.Length];

            Buffer.BlockCopy(first, 0, ret, 0, first.Length);
            Buffer.BlockCopy(second, 0, ret, first.Length, second.Length);

            return ret;
        }
        public static byte[] GenerateSalt()
        {
            const int saltLength = 32;

            using (var randomNumberGenerator = RandomNumberGenerator.Create())
            {
                var randomNumber = new byte[saltLength];
                randomNumberGenerator.GetBytes(randomNumber);

                return randomNumber;
            }
        }
        public string GetRandomOTP()
        {

            StringBuilder str_build = new StringBuilder();
            Random random = new Random();
            int otp = random.Next(111111, 999999);
            return otp.ToString();
        }
    }
}
