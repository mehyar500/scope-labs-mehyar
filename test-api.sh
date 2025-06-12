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
echo "est 2: Creating a test video..."
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

# Test 3: Create another test video
echo "Test 3: Creating another test video..."
curl -s -X POST "$API_BASE_URL/videos" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "'$USER_ID'",
    "title": "TypeScript Fundamentals",
    "description": "Master TypeScript basics including types, interfaces, and generics for better JavaScript development.",
    "video_url": "https://www.youtube.com/watch?v=gp5H0Vw39yw"
  }'
echo
echo

# Test 4: Create a third test video
echo "Test 4: Creating a third test video..."
curl -s -X POST "$API_BASE_URL/videos" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "'$USER_ID'",
    "title": "Redux Toolkit Tutorial",
    "description": "Learn modern Redux patterns with Redux Toolkit for efficient state management in React applications.",
    "video_url": "https://www.youtube.com/watch?v=9zySeP5vH9c"
  }'
echo
echo
