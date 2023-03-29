import styled from 'styled-components'
import Webcam from "react-webcam";

export const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #1b233b;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    & > .switch {
        margin-top: 2%;
    }
`

export const VideoBlock = styled.div`
    display: flex;
    background-color: black;
`

export const Canvas = styled.canvas`
    position: absolute;
    z-index: 5;
    overflow-x: visible;
`

export const CountDisplay = styled.div`
    font: 3rem Arial;
    color: white;
`
