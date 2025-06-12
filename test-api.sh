#!/bin/bash

# Test script for the Educational Video Player API
# This script tests the API endpoints to ensure they're working properly

API_BASE_URL="https://take-home-assessment-423502.uc.r.appspot.com/api"
USER_ID="mehyar_alkhouri"

echo "Testing Educational Video Player API..."
echo "API Base URL: $API_BASE_URL"
echo "User ID: $USER_ID"
echo

# Test 1: Get user videos
echo "Test 1: Getting user videos..."
curl -s -X GET "$API_BASE_URL/videos?user_id=$USER_ID" | head -200
echo
echo

# Test 2: Create a test video (example)
echo "Test 2: Creating a test video..."
curl -s -X POST "$API_BASE_URL/videos" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "'$USER_ID'",
    "title": "Introduction to React Hooks",
    "description": "Learn about React Hooks in this comprehensive tutorial covering useState, useEffect, and custom hooks.",
    "video_url": "https://www.youtube.com/watch?v=TNhaISOUy6Q"
  }'
echo
echo

# Test 3: Edit a video (example)
VIDEO_ID="REPLACE_WITH_VIDEO_ID" # Set this to a real video ID after creation

echo "Test 3: Editing a video..."
curl -s -X PUT "$API_BASE_URL/videos" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "'$USER_ID'",
    "video_id": "'$VIDEO_ID'",
    "title": "Updated React Hooks Title",
    "description": "Updated description for React Hooks tutorial.",
    "video_url": "https://www.youtube.com/watch?v=TNhaISOUy6Q"
  }'
echo

# Test 4: Get single video (example)
echo "Test 4: Getting a single video..."
curl -s -X GET "$API_BASE_URL/videos/single?user_id=$USER_ID&video_id=$VIDEO_ID"
echo

echo
# Test 5: Create a comment (example)
echo "Test 5: Creating a comment..."
curl -s -X POST "$API_BASE_URL/videos/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "'$USER_ID'",
    "video_id": "'$VIDEO_ID'",
    "comment": "This is a test comment from the API script."
  }'
echo

echo
# Test 6: Get video comments (example)
echo "Test 6: Getting video comments..."
curl -s -X GET "$API_BASE_URL/videos/comments?user_id=$USER_ID&video_id=$VIDEO_ID"
echo

