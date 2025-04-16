import { Injectable } from '@nestjs/common'
import { spawn } from 'child_process'
import { join } from 'path'

@Injectable()
export class ProcessorService {
  private isRunning = false
  private processorPath: string

  constructor() {
    this.processorPath = join(__dirname, '..', '..', '..', '..', 'squid', 'qf-explorer-squid')
  }

  async runUpdate(): Promise<{ status: string; message?: string }> {
    if (this.isRunning) {
      return { status: 'error', message: 'Processor is already running' }
    }

    try {
      this.isRunning = true
      console.log('Starting processor in directory:', this.processorPath)

      const npmPath = '/Users/vsevolodrusinskiy/.nvm/versions/node/v20.9.0/bin/npm'
      const child = spawn(npmPath, ['run', 'processor:start'], {
        cwd: this.processorPath
      })

      child.stdout.on('data', (data) => {
        console.log(`Processor output: ${data}`)
      })

      child.stderr.on('data', (data) => {
        console.error(`Processor error: ${data}`)
      })

      child.on('close', (code) => {
        console.log(`Processor exited with code ${code}`)
        this.isRunning = false
      })

      child.on('error', (error) => {
        console.error('Processor spawn error:', error)
        this.isRunning = false
        throw error
      })

      return { status: 'success', message: 'Processor started successfully' }
    } catch (error) {
      this.isRunning = false
      return {
        status: 'error',
        message: `Failed to start processor: ${error.message}`
      }
    }
  }

  getStatus(): { isRunning: boolean } {
    return { isRunning: this.isRunning }
  }
}