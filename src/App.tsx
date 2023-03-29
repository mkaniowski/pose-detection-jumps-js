import * as cocossd from "@tensorflow-models/coco-ssd";
import * as tfc from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as mpPose from '@mediapipe/pose';
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import "./App.css";
import { Canvas, VideoBlock, Wrapper, CountDisplay } from './App.style';
import { drawSkeleton, countJumps } from "./utlis";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [count, setCount] = useState(0)

  let lastPos = [0, 0, 0, 0]
  let prob = 0
  let jumpCount = 0

  const predict = async () => {
    poseDetection.createDetector(poseDetection.SupportedModels.MoveNet).then((detector: any) => {
      console.log('Detector loaded successfully')
      setInterval(() => {
        detect(detector)
      }, 50)
    }).catch((err: any) => {
      console.log(err)
    })
  }

  const detect = async (detector: any) => {
    const webCamCurrent: any = webcamRef.current
    const canvasCurrent: any = canvasRef.current
    const video: any = webCamCurrent.video

    if (webcamRef.current !== "undefined" && webcamRef.current !== null && video.readyState === 4) {
      const { width, height } = video.getBoundingClientRect();

      const videoWidth = width
      const videoHeight = height

      video.width = videoWidth
      video.height = videoHeight

      canvasCurrent.width = videoWidth
      canvasCurrent.height = videoHeight

      const poses = await detector.estimatePoses(video)
      const ctx = canvasCurrent.getContext("2d")
      // console.log(poses)
      drawSkeleton(poses, ctx)
      const out = countJumps(poses, lastPos, prob)
      if (out !== undefined) {
          lastPos = out.lastPose
          prob = out.prob
          // console.log(lastPos, prob)
        }
      if (prob > 10) {
        console.log('Jump!', jumpCount)
        jumpCount = jumpCount + 1
        setCount(jumpCount)
        prob = 0
      }
    }
  }

  useEffect(()=>{
    predict()
  }, [])

  return (
    <Wrapper>
      <CountDisplay>{count}</CountDisplay>
      <VideoBlock>
        <Webcam
          audio={false}
          ref={webcamRef}
        />
        <Canvas
          ref={canvasRef}
        />
      </VideoBlock>
    </Wrapper>
  )
}

export default App;