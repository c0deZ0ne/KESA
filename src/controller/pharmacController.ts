import express, { Request, Response } from "express";

export const searchPhamacy = async (req: Request, res: Response) => {
  res.render("search-phamacy");
};
