FROM python:3.10 AS builder

RUN pip install --user pipenv

ENV PIPENV_VENV_IN_PROJECT=1

COPY Pipfile.lock /app/Pipfile.lock

WORKDIR /app

RUN /root/.local/bin/pipenv sync

COPY src src
COPY resources resources
COPY content content
COPY templates templates
COPY build.py build.py

RUN /root/.local/bin/pipenv run python build.py

FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /usr/share/nginx/html