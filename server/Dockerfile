FROM golang:1.22 AS builder
WORKDIR /build
COPY . .
RUN go build -o /build/bin/dist .
EXPOSE 8080
CMD ["/build/bin/dist"]

