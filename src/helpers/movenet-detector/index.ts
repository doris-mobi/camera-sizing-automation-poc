import * as poseDetection from '@tensorflow-models/pose-detection'


export class MovenetDetector {
  private _poseDetector: poseDetection.PoseDetector | undefined
  private _modelConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }

  get poseDetector() {
    return this._poseDetector
  }

  async initialize() {
    if (this._poseDetector) return

    
    this._poseDetector = await  poseDetection
    .createDetector(poseDetection.SupportedModels.MoveNet, this._modelConfig)
  }
}