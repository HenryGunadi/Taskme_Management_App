FROM golang:1.22 AS builder
WORKDIR /build
COPY . .
RUN go build -o /build/bin/server.exe
EXPOSE 8080
CMD ["/build/bin/server.exe"]

