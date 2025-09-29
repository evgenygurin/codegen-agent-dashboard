import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Mock Cyrus status data
    const status = {
      isRunning: true,
      lastActivity: new Date().toISOString(),
      activeIssues: 3,
      processedIssues: 47,
      errorCount: 2,
      repositories: [
        {
          id: "repo1",
          name: "Main Repository",
          isActive: true,
          lastProcessed: new Date().toISOString()
        }
      ]
    }

    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Cyrus status' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, configId } = await req.json()

    switch (action) {
      case 'toggle':
        // Mock toggle Cyrus agent
        return NextResponse.json({ 
          success: true, 
          message: 'Cyrus agent toggled successfully' 
        })
      
      case 'toggle_repository':
        // Mock toggle repository
        return NextResponse.json({ 
          success: true, 
          message: `Repository ${configId} toggled successfully` 
        })
      
      case 'update_config':
        // Mock update configuration
        return NextResponse.json({ 
          success: true, 
          message: 'Configuration updated successfully' 
        })
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process Cyrus action' },
      { status: 500 }
    )
  }
}
