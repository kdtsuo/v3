import rmlogo from "@/assets/img/rmlogo.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useTheme } from "@/hooks";

export default function Footer() {
  const getYear = () => {
    const date = new Date();
    return date.getFullYear();
  };
  const { theme } = useTheme();
  return (
    <Card
      className='text-center py-10 bg-primary-foreground rounded-none border-none'
      style={{
        background: `var(--bg-xless-dotted-${
          theme === "dark" ? "dark" : "light"
        })`,
      }}
    >
      <CardHeader>
        <CardTitle>&copy; {getYear()} KDT ("KPop Dance Team")</CardTitle>
        <CardDescription className='text-lg'></CardDescription>
      </CardHeader>
      <CardContent>
        <div className='text-sm flex items-center justify-center space-x-2'>
          <p>Made with ❤️ by</p>
          <span>
            <a
              href='https://rinmeng.github.io'
              target='_blank'
              rel='noreferrer'
            >
              <img src={rmlogo} alt='rmlogo' className='w-16 h-auto mx-1' />
            </a>
          </span>
        </div>
        <p>
          All photos are provided by{" "}
          <a
            className='underline '
            href='https://www.tsengphoto.ca/'
            target='_blank'
          >
            Tseng Photography
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
}
