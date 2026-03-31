from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Numeric, Date, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime, timezone

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    login = Column(String(50), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    nickname = Column(String(100), nullable=True)
    photo = Column(String(500), nullable=True)
    email = Column(String(100), unique=True, nullable=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    classifieds = relationship("Classified", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")

    chats_as_user1 = relationship(
        "Chat",
        foreign_keys="Chat.id_user1",
        back_populates="user1",
        cascade="all, delete-orphan"
    )
    chats_as_user2 = relationship(
        "Chat",
        foreign_keys="Chat.id_user2",
        back_populates="user2",
        cascade="all, delete-orphan"
    )
    messages = relationship("Message", back_populates="user", cascade="all, delete-orphan")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(500), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="refresh_tokens")


class Classified(Base):
    __tablename__ = "classifieds"

    class_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    learnings = Column(Text, nullable=True)
    cost = Column(Numeric(10, 2), nullable=True)
    coef_prom = Column(Numeric(10, 2), nullable=True)

    user = relationship("User", back_populates="classifieds")
    categories = relationship("CatClass", back_populates="classified", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="classified", cascade="all, delete-orphan")
    chats = relationship("Chat", back_populates="classified", cascade="all, delete-orphan")


class Category(Base):
    __tablename__ = "categories"

    id_category = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)

    classifieds = relationship("CatClass", back_populates="category", cascade="all, delete-orphan")


class CatClass(Base):
    __tablename__ = "cat_class"

    id_cat_class = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classifieds.class_id", ondelete="CASCADE"), nullable=False)
    id_category = Column(Integer, ForeignKey("categories.id_category", ondelete="CASCADE"), nullable=False)

    classified = relationship("Classified", back_populates="categories")
    category = relationship("Category", back_populates="classifieds")


class Review(Base):
    __tablename__ = "reviews"

    id_review = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classifieds.class_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    description = Column(Text, nullable=True)
    date = Column(Date, nullable=False)
    mark = Column(Integer, nullable=False)

    classified = relationship("Classified", back_populates="reviews")
    user = relationship("User", back_populates="reviews")


class Chat(Base):
    __tablename__ = "chats"

    id_chat = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classifieds.class_id", ondelete="CASCADE"), nullable=False)
    id_user1 = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    id_user2 = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    classified = relationship("Classified", back_populates="chats")
    user1 = relationship("User", foreign_keys=[id_user1], back_populates="chats_as_user1")
    user2 = relationship("User", foreign_keys=[id_user2], back_populates="chats_as_user2")
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id_messages = Column(Integer, primary_key=True, index=True)
    id_chat = Column(Integer, ForeignKey("chats.id_chat", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=False)
    datetime = Column(TIMESTAMP, default=datetime.utcnow, nullable=False)

    chat = relationship("Chat", back_populates="messages")
    user = relationship("User", back_populates="messages")