import axios from "axios";

export const postData = async <TData>(endpoint: string, data: TData) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}${endpoint}`,
      data
    );

    // If the POST request is successful, return the response data
    return response.data;
  } catch (error) {
    // If there is an error, you can handle it here, for example, by throwing an error
    throw new Error((error as Error).message);
  }
};
