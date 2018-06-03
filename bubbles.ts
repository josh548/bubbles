const canvas: HTMLCanvasElement =
    document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const context: CanvasRenderingContext2D =
    canvas.getContext("2d") as CanvasRenderingContext2D;

const defaultRadius: number =
    Math.floor(Math.min(canvas.width, canvas.height) / 10);
const defaultSpeed: number =
    Math.round(Math.min(canvas.width, canvas.height) / 200);

const messages: string[] = "bubbles".split("");
let messageIndex: number = 0;

class Bubble {
    public x: number;
    public y: number;
    public readonly radius: number;
    public vx: number;
    public vy: number;
    public readonly hue: number;
    public readonly text: string;

    public constructor(x: number, y: number, radius: number, vx: number,
                       vy: number, hue: number, text: string) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.hue = hue;
        this.text = text;
    }

    public draw(): void {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fillStyle = `hsl(${this.hue}, 100%, 80%)`;
        context.fill();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `${Math.floor(this.radius * 0.75)}px sans-serif`;
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillText(this.text, this.x, this.y);
    }
}

function createBubble(x: number, y: number): Bubble {
    const angle: number = Math.floor(Math.random() * 360);
    const vx: number = Math.cos(angle) * defaultSpeed;
    const vy: number = Math.sin(angle) * defaultSpeed;
    const hue: number = Math.floor(Math.random() * 360);
    const text: string = messages[messageIndex];
    messageIndex++;
    if (messageIndex === messages.length) {
        messageIndex = 0;
    }
    return new Bubble(x, y, defaultRadius, vx, vy, hue, text);
}

function draw(): void {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const bubble of bubbles) {
        bubble.draw();
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        if ((bubble.x < bubble.radius && bubble.vx < 0) ||
            (bubble.x + bubble.radius >= canvas.width && bubble.vx > 0)) {
            bubble.vx = -bubble.vx;
        }
        if ((bubble.y < bubble.radius && bubble.vy < 0) ||
            (bubble.y + bubble.radius >= canvas.height && bubble.vy > 0)) {
            bubble.vy = -bubble.vy;
        }
    }
    requestAnimationFrame(draw);
}

const bubbles: Bubble[] = [];
const centerX: number = Math.floor(canvas.width / 2);
const centerY: number = Math.floor(canvas.height / 2);
bubbles.push(createBubble(centerX, centerY));
draw();

canvas.addEventListener("click", (event: MouseEvent) => {
    bubbles.push(createBubble(event.clientX, event.clientY));
});
