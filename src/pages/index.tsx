import { Button } from "@/components/ui/button";
import TableManagement from "@/feature/table";
import { InteractiveBrowserCredential } from "@azure/identity";
import { useState } from "react";

// Token Acquisition - Development Only
async function acquireToken() {
  try {
    const credential = new InteractiveBrowserCredential({
      clientId: "04b07795-8ddb-461a-bbee-02f9e1bf7b46",
    });
    const tokenResponse = await credential.getToken(
      "https://analysis.windows.net/powerbi/api/user_impersonation"
    );
    return tokenResponse?.token; // Safely return the token
  } catch (error) {
    console.error("Error acquiring token:", error);
    return null;
  }
}

const testToken = null;
// "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InoxcnNZSEhKOS04bWdndDRIc1p1OEJLa0JQdyIsImtpZCI6InoxcnNZSEhKOS04bWdndDRIc1p1OEJLa0JQdyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZDdjOTQ2NzMtZjBhZC00MTBkLWI2YjUtNzg3YTI5YThjYjNmLyIsImlhdCI6MTczNjMyODg4OSwibmJmIjoxNzM2MzI4ODg5LCJleHAiOjE3MzYzMzQyNjQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84WUFBQUFxSjFpczlLM2YyTmZld2tUSmN6U2dNaGRiZ1N4d0pLVUprVXJKaThyaGcwY0E0MXdIYlFFVmwwWjhoSzR2T3BxIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjA0YjA3Nzk1LThkZGItNDYxYS1iYmVlLTAyZjllMWJmN2I0NiIsImFwcGlkYWNyIjoiMCIsImdpdmVuX25hbWUiOiJGYWJyaWNBZG1pbiIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjE3MS4yNDcuMTY1LjIxMyIsIm5hbWUiOiJGYWJyaWNBZG1pbiIsIm9pZCI6ImEzOTM1YzNhLTAxODQtNDY3Yy05NTAwLTRiYTc1MTMyZWJjNyIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0xNzI0MzI1Nzg4LTI3NTkxMzAyNjItMTMzNzU4OTU3LTIxMDU5IiwicHVpZCI6IjEwMDMyMDA0MDM0NjRCMEMiLCJyaCI6IjEuQVNzQWMwYkoxNjN3RFVHMnRYaDZLYWpMUHdrQUFBQUFBQUFBd0FBQUFBQUFBQURvQU9RckFBLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IjNCcEhuVVJKYnY0QVRrWEZDeU9kM1NNdjBNeGozMHJjekkxWTVsVkprU1EiLCJ0aWQiOiJkN2M5NDY3My1mMGFkLTQxMGQtYjZiNS03ODdhMjlhOGNiM2YiLCJ1bmlxdWVfbmFtZSI6IkZhYnJpY0FkbWluQHB2aS5jb20udm4iLCJ1cG4iOiJGYWJyaWNBZG1pbkBwdmkuY29tLnZuIiwidXRpIjoiR05QT19RYVRnVUtQVFhYMFdmOUxBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19pZHJlbCI6IjEgMjIifQ.b3NBm07i8j7ZjbvcRtjQiwTDvEHX8Sfknu4_LHTNoNi73atvxE4UwXxgJyjxKusMcbK84zH4ZeRAhPzz5IZcBk1M3z8Q2kkTVNt4dA1gQGy6oqjEAGsoHDkprVT5GkYeuZULSHLOcDeNhV73nfCUUKA-Vprirbr_k66Eoq4DzolMkHSSSNmHN4Skdy3P0iUIABMX-Fx25f_t6s0sF5zyALL0A94Vh6SdWq40R4ifFfS4jraHYWvWEWRiAj63xr5DXK4jdsmv2LLaY29FyNEZtvmzy2eZBQ19_SJlYNGyoHTyDwo9j7yiFr1N6dttYrCSWbflBK-nBQzEul0Jo3oNbg";
export default function Home() {
  const [token, setToken] = useState<string | null>(testToken);

  const handleLogin = async () => {
    const _token = await acquireToken();
    setToken(_token);
  };

  return (
    <div className='min-h-dvh w-full overflow-hidden bg-white p-6'>
      {!token ? (
        <div className='flex items-center h-full justify-center bg-white'>
          <Button onClick={handleLogin}>Get Token</Button>
        </div>
      ) : (
        <TableManagement token={token} />
      )}
    </div>
  );
}
