from pydantic import BaseModel


class CategoryCreateSchema(BaseModel):
    name: str


class CategoryUpdateSchema(BaseModel):
    name: str


class CategoryResponseSchema(BaseModel):
    id_category: int
    name: str

    class Config:
        from_attributes = True


class CatClassResponseSchema(BaseModel):
    id_cat_class: int
    class_id: int
    id_category: int

    class Config:
        from_attributes = True
