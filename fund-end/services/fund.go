package services

import (
	"github.com/fund-go/db"
	"github.com/fund-go/models"
)

// GetFunds err funds 获取查询结果集
func GetFunds(query models.Fund) (funds []models.Fund, err error) {
	return funds, db.InitDB().Where(query).Find(&funds).Error
}

// AddFund err 添加记录
func AddFund(fund *models.Fund) error {
	return db.InitDB().Create(&fund).Error
}
