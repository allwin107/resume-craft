"""add feedback table

Revision ID: 003_add_feedback
Revises: 002_add_resume_versions
Create Date: 2026-01-28 13:15:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '003_add_feedback'
down_revision = '002_add_resume_versions'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'feedback',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('rating', sa.Integer(), nullable=True),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_feedback_id', 'feedback', ['id'], unique=False)
    op.create_index('ix_feedback_user_id', 'feedback', ['user_id'], unique=False)
    op.create_index('ix_feedback_created_at', 'feedback', ['created_at'], unique=False)


def downgrade():
    op.drop_index('ix_feedback_created_at', table_name='feedback')
    op.drop_index('ix_feedback_user_id', table_name='feedback')
    op.drop_index('ix_feedback_id', table_name='feedback')
    op.drop_table('feedback')
