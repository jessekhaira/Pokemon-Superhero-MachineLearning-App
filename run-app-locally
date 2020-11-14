#!/bin/bash

(trap 'kill 0' SIGINT; 
    cd backend && npm start &
    pip install -e . && cd ML_Model_Serving && python3 app.py)
