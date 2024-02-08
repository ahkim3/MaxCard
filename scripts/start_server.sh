#!/bin/bash

cd /var/MaxCard/

source venv/bin/activate

echo "--Installing Requirements--"
python3 -m pip install -r requirements.txt

echo "--starting server--"
script /dev/null
screen -d -m python3 ./app.py

if [ $? -eq 0 ]
then
  echo "--server running server--"
else
  echo "Error encountered while starting the server. Check output.log for details."
  exit 1
fi

exit 0