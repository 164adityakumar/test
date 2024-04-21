import { Vortex } from "../../components/ui/vortex";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaArrowLeft } from "react-icons/fa"
import { IoIosArrowForward } from "react-icons/io";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import axios from "axios";
import { atom, useRecoilState } from "recoil";
import { useRouter } from 'next/router'
import { wsManager } from "@/utils/ws";



export function InputOTPControlled() {

  const [value, setValue] = useRecoilState(RoomId)
 
  return (
    <div className="space-y-2 ">
      <InputOTP
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        value={value}
        onChange={(value) => setValue(value)}
        className="w-full"
      >
        <InputOTPGroup className=" border border-slate-500 rounded-md ">
          <InputOTPSlot index={0} className="p-5" />
          <InputOTPSlot index={1} className="p-5"/>
          <InputOTPSlot index={2} className="p-5"/>
          <InputOTPSlot index={3} className="p-5"/>
          <InputOTPSlot index={4} className="p-5"/>
          <InputOTPSlot index={5} className="p-5"/>
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
        {value === "" ? (
          <>Enter your Room ID</>
        ) : (
          <>You entered: {value}</>
        )}
      </div>
    </div>
  )
}


export function CardWithForm() {
 


  const [roomId] = useRecoilState(RoomId)
  const router = useRouter()
  
  function handleRoomCreation() {
    axios.post(`${process.env.API_URL}/api/rooms/create`, {
      roomId: roomId
    }).then((res) => {
      console.log(`Status: ${res.status}`);
      console.log('Body: ', res.data);
    })
    .catch((err) => {
      console.error(err);
    });
  
  }
  
  return (
    <Card className="w-[350px] bg-opacity-80 border-slate-800 ">
      <CardHeader>
        <CardTitle>Create Room</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col  w-full items-center gap-4 ">
            <div className="flex flex-col space-y-1.5 w-[15.3rem]">
              <Label htmlFor="name">Room Name</Label>
              <Input id="name" placeholder="Name your Vibe room" className="border-slate-500 p-5" />
            </div>
            <div className=" space-y-1.5">
              <InputOTPControlled />              
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="rounded-full" onClick={() => window.history.back()}><FaArrowLeft /></Button>
        <Button className="rounded-full bg-purple-200 font-medium" onClick={handleRoomCreation}>Create<span><IoIosArrowForward className="-mr-1" /></span></Button>
        <Button className="rounded-full bg-purple-200 font-medium" onClick={() => wsManager.handleRoomJoin(roomId, router)}>JOIN</Button>
      </CardFooter>
    </Card>
  )
}

export default function Create() {
    const router = useRouter();
    const { access_token } = router.query;

    if (typeof access_token === 'string') {
      localStorage.setItem('access_token', access_token);
    }

    return (
        <div className=" mx-auto h-[100vh]  overflow-hidden">
            <Vortex
                backgroundColor="black"
                className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
                particleCount={2000}
                rangeY={300}
                baseHue={200}
            >
                <div className="flex flex-col items-center gap-4 mt-6 bg-white bg-opacity-25 rounded-xl">
                    <CardWithForm />
                </div>
                </Vortex>
        </div>
    );
}




const RoomId = atom({
  key: "roomId",
  default: "",
});

const WS= atom({
  key: "ws",
  default: "",
});