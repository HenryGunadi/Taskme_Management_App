package auth

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func HashedPassword (password string) (string, error) {
	hashedPass, err := bcrypt.GenerateFromPassword([]byte (password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("hashing password error : %v", err)
	}

	return string(hashedPass), nil
}

func ComparePass (hashedPass string, plain []byte) error {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPass), plain)
	if err != nil {
		return err
	}
	return nil
}