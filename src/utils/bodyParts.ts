export interface BodyRegion {
  name: string;
  bones: string[];
  description: string;
}

export const bodyRegions: BodyRegion[] = [
  {
    name: 'Head',
    bones: ['Head', 'Neck', 'HeadTop_End'],
    description: 'Brain, cognitive function, and mental health supplements'
  },
  {
    name: 'Torso',
    bones: ['Spine', 'Spine1', 'Spine2', 'Hips'],
    description: 'Core strength, digestive health, and posture supplements'
  },
  {
    name: 'Arms',
    bones: [
      'LeftShoulder', 'LeftArm', 'LeftForeArm', 'LeftHand',
      'RightShoulder', 'RightArm', 'RightForeArm', 'RightHand'
    ],
    description: 'Joint health, muscle recovery, and strength supplements'
  },
  {
    name: 'Legs',
    bones: [
      'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase',
      'RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase'
    ],
    description: 'Mobility, joint support, and circulation supplements'
  },
  {
    name: 'Hands',
    bones: [
      'LeftHandThumb1', 'LeftHandIndex1', 'LeftHandMiddle1', 'LeftHandRing1', 'LeftHandPinky1',
      'RightHandThumb1', 'RightHandIndex1', 'RightHandMiddle1', 'RightHandRing1', 'RightHandPinky1'
    ],
    description: 'Fine motor skills and joint flexibility supplements'
  }
];

export function getBoneRegion(boneName: string): BodyRegion | undefined {
  return bodyRegions.find(region => 
    region.bones.some(bone => boneName.includes(bone))
  );
}

export function getReadableBoneName(boneName: string): string {
  // Remove Left/Right prefix and numbers
  let readable = boneName
    .replace(/^(Left|Right)/, '')
    .replace(/\d+$/, '');
  
  // Add spaces before capital letters
  readable = readable.replace(/([A-Z])/g, ' $1').trim();
  
  return readable;
} 