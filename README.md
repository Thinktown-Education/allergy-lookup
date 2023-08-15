# TODO
图片链接

# Dev Environment 开发环境
## Frontend
In frontend root directory:
```sh
npm install
npm start
```

## Backend
First time user: \
You need to install a venv(virtual environment) for this project. In your backend root directory, create venv for this project
```sh
python3 -m venv venv
```

Then activate then venv with
```sh
source ./venv/bin/activate
```
(Optional) If there are new dependencies, run this command:

```sh
pip3 install -r requirements.txt
```

Setup environment variables:
```sh
export FLASK_APP=.
export FLASK_DEBUG=1
```

Run the project
```sh
flask run
```

# Prod Environment 生产环境
[看这里](./notes/deployment.md)