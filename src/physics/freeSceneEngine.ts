import Matter from 'matter-js';
import type { FreePhysicsScene, SceneObject } from '../types/physics';

export interface SimulatedObject extends SceneObject {
  renderX: number;
  renderY: number;
  renderAngle: number;
}

export interface SimulatedScene {
  objects: SimulatedObject[];
}

export function simulateFreeScene(scene: FreePhysicsScene, time: number): SimulatedScene {
  const engine = Matter.Engine.create({ enableSleeping: false });
  engine.gravity.y = scene.settings.gravity / 9.8;
  engine.gravity.x = 0;

  const bodyMap = new Map<string, Matter.Body>();
  const bodies = scene.objects.map((object) => {
    const body = createBody(object);
    const scale = scene.settings.pixelsPerMeter;
    Matter.Body.setVelocity(body, {
      x: object.velocityX * scale * (1 / 60),
      y: object.velocityY * scale * (1 / 60),
    });
    bodyMap.set(object.id, body);
    return body;
  });

  Matter.Composite.add(engine.world, bodies);

  const steps = Math.max(0, Math.min(600, Math.round(time * 60)));
  for (let i = 0; i < steps; i += 1) {
    Matter.Engine.update(engine, 1000 / 60);
  }

  return {
    objects: scene.objects.map((object) => {
      const body = bodyMap.get(object.id);
      return {
        ...object,
        renderX: body?.position.x ?? object.x,
        renderY: body?.position.y ?? object.y,
        renderAngle: body ? (body.angle * 180) / Math.PI : object.angle,
      };
    }),
  };
}

function createBody(object: SceneObject): Matter.Body {
  const options = {
    label: object.id,
    angle: degreesToRadians(object.angle),
    friction: object.friction,
    restitution: object.restitution,
    isStatic: object.isStatic,
  };

  const body =
    object.type === 'ball'
      ? Matter.Bodies.circle(object.x, object.y, object.radius ?? object.width / 2, options)
      : Matter.Bodies.rectangle(object.x, object.y, object.width, object.height, options);

  if (!object.isStatic) {
    Matter.Body.setMass(body, Math.max(0.1, object.mass));
  }

  return body;
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}
