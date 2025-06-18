<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Object Shuffler</title>
    <script src="https://miro.com/app/static/sdk/v2/miro.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8f9fa;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #0099ff 0%, #0066cc 100%);
            color: white;
            padding: 24px;
            text-align: center;
        }

        .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }

        .content {
            padding: 24px;
        }

        .instructions {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
            border-left: 4px solid #0099ff;
        }

        .instructions h3 {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 16px;
        }

        .instructions ol {
            padding-left: 24px;
            color: #666;
        }

        .instructions li {
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.5;
        }

        .shuffle-section {
            margin-bottom: 24px;
        }

        .selection-info {
            background: #e3f2fd;
            border: 1px solid #0099ff;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            text-align: center;
        }

        .selection-count {
            font-size: 18px;
            font-weight: 600;
            color: #0066cc;
            margin-bottom: 4px;
        }

        .selection-text {
            font-size: 14px;
            color: #666;
        }

        .shuffle-button {
            width: 100%;
            background: #0099ff;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 16px 24px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .shuffle-button:hover:not(:disabled) {
            background: #0088ee;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 153, 255, 0.3);
        }

        .shuffle-button:active:not(:disabled) {
            transform: translateY(0);
        }

        .shuffle-button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .status-message {
            margin-top: 16px;
            padding: 12px;
            border-radius: 6px;
            text-align: center;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .status-message.show {
            opacity: 1;
        }

        .status-message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .status-message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .shuffle-icon {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        .loading-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <div class="container fade-in">
        <div class="header">
            <h1>Object Shuffler</h1>
            <p class="subtitle">Randomly arrange your selected objects</p>
        </div>
        
        <div class="content">
            <div class="instructions">
                <h3>How to use:</h3>
                <ol>
                    <li>Select 2 or more objects on your board</li>
                    <li>Click the "Shuffle Objects" button below</li>
                    <li>Watch your objects rearrange randomly!</li>
                </ol>
            </div>
            
            <div class="shuffle-section">
                <div class="selection-info">
                    <div class="selection-count" id="selectionCount">0</div>
                    <div class="selection-text">objects selected</div>
                </div>
                
                <button class="shuffle-button" id="shuffleButton" disabled>
                    <svg class="shuffle-icon" viewBox="0 0 24 24">
                        <path d="M14,20A2,2 0 0,1 12,18A2,2 0 0,1 14,16H16V14L20,17L16,20M10,4A2,2 0 0,1 12,6A2,2 0 0,1 10,8H8V10L4,7L8,4M16.5,12A2.5,2.5 0 0,0 14,9.5H10A2.5,2.5 0 0,0 7.5,12A2.5,2.5 0 0,0 10,14.5H14A2.5,2.5 0 0,0 16.5,12Z"/>
                    </svg>
                    <span id="buttonText">Select objects to shuffle</span>
                </button>
                
                <div class="status-message" id="statusMessage"></div>
            </div>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>
