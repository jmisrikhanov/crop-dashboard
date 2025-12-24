import { Button, Result } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black transition-colors">
      <div className="text-center px-4">
        <Result
          status="404"
          title={<h1 className="text-4xl font-bold dark:text-white">404</h1>}
          subTitle={
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Sorry, the page you visited does not exist.
            </p>
          }
          extra={
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
            >
              Back to home
            </Button>
          }
        />
      </div>
    </div>
  );
};
