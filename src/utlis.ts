import * as poseDetection from '@tensorflow-models/pose-detection';

export const drawSkeleton = (poses: any, ctx: any) => {
    poses.forEach((pred: any) => {
        // console.log(pred)

        poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet).forEach(([i, j]) => {
            const kp1 = pred.keypoints[i]
            const kp2 = pred.keypoints[j]

            ctx.beginPath()
            ctx.fillStyle = 'red'
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 2
            ctx.fillRect(kp1.x-3, kp1.y-3, 6, 6)
            ctx.fill();

            ctx.beginPath()
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'white'
            ctx.lineWidth = 2
            ctx.moveTo(kp1.x, kp1.y)
            ctx.lineTo(kp2.x, kp2.y)
            ctx.stroke()
        })
    })
}


export const countJumps = (poses: any, lastPose: any, prob: any) => {
    const lastLeftHip = lastPose[0]
    const lastRightHip = lastPose[1]
    const lastLeftAnkle = lastPose[2]
    const lastRightAnkle = lastPose[3]
    // console.log(poses)
    if (poses !== undefined) {
        const kps = poses[0].keypoints
        const leftHip = kps[11].y
        const rightHip = kps[12].y
        const leftAnkle = kps[15].y
        const rightAnkle = kps[16].y
        // console.log(leftHip)

        if ((lastLeftHip - leftHip > 10) && (lastRightHip - rightHip > 10) && (lastLeftAnkle - leftAnkle > 10) && (lastRightAnkle - rightAnkle > 10)) {
            prob = prob + 1
            // console.log(prob)
        }

        if ((prob > 5) && (lastLeftHip - leftHip < - 10) && (lastRightHip - rightHip < - 10) && (lastLeftAnkle - leftAnkle < - 10) && (lastRightAnkle - rightAnkle < - 10)) {
            prob = prob + 1
            // console.log(prob)
        }

        return {
            lastPose: [leftHip, rightHip, leftAnkle, rightAnkle], 
            prob: prob
        }
    }
}