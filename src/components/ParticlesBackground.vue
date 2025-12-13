<template>
  <div ref="container" class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const container = ref(null)
const canvas = ref(null)
let ctx = null
let animationFrameId = null
let particles = []
let mouse = { x: null, y: null }

const props = defineProps({
  particleCount: {
    type: Number,
    default: 100
  },
  particleColor: {
    type: String,
    default: '#ffffff'
  },
  connectionColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.1)'
  },
  interactive: {
    type: Boolean,
    default: true
  }
})

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.size = Math.random() * 2 + 1
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    // Bounce off edges
    if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1
    if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1

    // Interaction with mouse
    if (props.interactive && mouse.x != null) {
      const dx = mouse.x - this.x
      const dy = mouse.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < 100) {
        const forceDirectionX = dx / distance
        const forceDirectionY = dy / distance
        const force = (100 - distance) / 100
        const directionX = forceDirectionX * force * 0.05
        const directionY = forceDirectionY * force * 0.05
        this.vx -= directionX
        this.vy -= directionY
      }
    }
  }

  draw(context) {
    context.fillStyle = props.particleColor
    context.beginPath()
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    context.fill()
  }
}

const init = () => {
  if (!container.value || !canvas.value) return
  
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  
  canvas.value.width = width
  canvas.value.height = height
  
  ctx = canvas.value.getContext('2d')
  particles = []
  
  for (let i = 0; i < props.particleCount; i++) {
    particles.push(new Particle(width, height))
  }
}

const animate = () => {
  if (!ctx || !canvas.value) return
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  particles.forEach(particle => {
    particle.update()
    particle.draw(ctx)
  })
  
  // Draw connections
  particles.forEach((a, index) => {
    for (let j = index + 1; j < particles.length; j++) {
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 100) {
        ctx.strokeStyle = props.connectionColor
        ctx.lineWidth = 1 - distance / 100
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  })
  
  animationFrameId = requestAnimationFrame(animate)
}

const handleResize = () => {
  init()
}

const handleMouseMove = (e) => {
  const rect = canvas.value.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
}

const handleMouseLeave = () => {
  mouse.x = null
  mouse.y = null
}

onMounted(() => {
  init()
  animate()
  window.addEventListener('resize', handleResize)
  if (props.interactive && container.value) {
    container.value.addEventListener('mousemove', handleMouseMove)
    container.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', handleResize)
  if (container.value) {
    container.value.removeEventListener('mousemove', handleMouseMove)
    container.value.removeEventListener('mouseleave', handleMouseLeave)
  }
})
</script>
